# utils.py

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

async   def send_html_email(subject, template_name, context, recipient_list, sender=None):
    """
    Utility function to send an HTML email using a template.
    
    :param subject: Email subject
    :param template_name: Path to the HTML template file
    :param context: Context dictionary to render the template
    :param recipient_list: List of recipient email addresses
    :param sender: The sender's email address (optional, default is EMAIL_HOST_USER)
    :return: None
    """
    html_content = render_to_string(template_name, context)
    
    text_content = strip_tags(html_content)
    
    if sender is None:
        from django.conf import settings
        sender = settings.EMAIL_HOST_USER
    
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,  # Fallback plain-text content
        from_email=sender,
        to=recipient_list
    )
    
    email.attach_alternative(html_content, "text/html")
    
    email.send()
