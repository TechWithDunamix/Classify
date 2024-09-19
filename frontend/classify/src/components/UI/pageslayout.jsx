import Navbar from "../widgets/pagesnavbar"
const PagesLayout = ({children}) => {
    return (
        <div>
            <div className="fixed w-full -mt-[6rem] z-50">
            <Navbar />
            </div>
            <div className="min-h-[80vh] mt-24 flex flex-1 flex-col items-center">
            {children}

            </div>
            <div>
                footer
            </div>
        </div>
    )
}

export default PagesLayout