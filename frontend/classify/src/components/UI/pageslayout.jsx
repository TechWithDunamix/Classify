import Navbar from "../widgets/pagesnavbar"
const PagesLayout = ({children}) => {
    return (
        <div>
            <div className="fixed w-full -mt-[6rem] z-50">
            <Navbar />
            </div>
            <div className="min-h-[80vh] mb-2 mt-24">
            {children}

            </div>
            <div>
                footer
            </div>
        </div>
    )
}

export default PagesLayout