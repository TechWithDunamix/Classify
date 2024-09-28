import Navbar from "../widgets/pagesnavbar"
const PagesLayout = ({children}) => {
    return (
        <div>
            <div className="w-full">
            <Navbar />
            </div>
            <div className="min-h-[80vh] flex flex-1 flex-col items-center">
            {children}

            </div>
            
        </div>
    )
}

export default PagesLayout