import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
    return (
        <footer className="bg-background py-6 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="/about" className="hover:underline">About Us</a></li>
                            <li><a href="/contact" className="hover:underline">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Resources</h3>
                        <ul className="space-y-2">
                            <li><a href="/blog" className="hover:underline">Blog</a></li>
                            <li><a href="/faq" className="hover:underline">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Connect</h3>
                        <ul className="space-y-2">
                            <li><a href="https://instagram.com" className="hover:underline">Instagram</a></li>
                            <li><a href="https://facebook.com" className="hover:underline">Facebook</a></li>
                        </ul>
                    </div>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Blooming Delights. All rights reserved.</p>
                    <p className="text-sm text-muted-foreground">A ETICAlgarve meteu aqui o dedinho.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="/terms" className="text-sm text-muted-foreground hover:underline">Terms</a>
                        <a href="/privacy" className="text-sm text-muted-foreground hover:underline">Privacy</a>
                        <a href="/cookies" className="text-sm text-muted-foreground hover:underline">Cookies</a>
                    </div>
                </div>
                
            </div>
        </footer>
    );
}

export default Footer