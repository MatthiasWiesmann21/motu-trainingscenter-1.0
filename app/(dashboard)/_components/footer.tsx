const Footer = () => {
    return (
        <div className="md:pl-72">
            <footer className="p-4 w-full bg-white dark:bg-[#313338] border-t flex flex-col lg:flex-row items-start justify-around lg:items-center">
                <div className="text-xs text-muted-foreground py-2 px-4 lg:flex-1">
                © 2023 ENRA d.o.o. All rights reserved.
                </div>
                <a className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline h-10 px-4 py-2 text-muted-foreground text-xs" href="mailto:matthiaswiesmann@outlook.com">
                    Contact
                </a>
                <a target="_blank" className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline h-10 px-4 py-2 text-muted-foreground text-xs" href="https://www.termsfeed.com/live/c4fac2c8-eb0c-4d33-8cd5-f4045a426832">
                    Terms of Service
                </a>
                <a target="_blank" className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline h-10 px-4 mr-10 py-2 text-muted-foreground text-xs" href="https://www.termsfeed.com/live/fe139ac7-ccfa-4ef3-907c-7e4d38a5d61c">
                    Privacy Policy
                </a>
                
{/*                     <div className="absolute bottom-0 right-0 m-4 ">
                        <Chatbot />
                    </div> */}
            </footer>
        </div>
    );
}
 
export default Footer;