import Navbar from "../widgets/pagesnavbar"
const PagesLayout = ({children}) => {
    return (
        <div>
            <Navbar />
            <div className="min-h-[100vh] mb-2">
            {children}

            </div>
            <div>
                footer
            </div>
        </div>
    )
}

export default PagesLayout