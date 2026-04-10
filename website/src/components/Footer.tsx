import Link from "next/link";
import { Brain, Mail, Phone, GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-rose-line bg-secondary/50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-6 h-6 text-primary" />
              <span className="font-pixel text-xs text-primary">ThinkFirst</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Train your brain before using AI. Stay sharp, stay human.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-pixel text-[10px] text-primary mb-4 tracking-wider">LINKS</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/shop" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              <Link href="/achievements" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Gallery
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-pixel text-[10px] text-primary mb-4 tracking-wider">CONTACT</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="mailto:thinkfirst@example.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> thinkfirst@example.com
              </a>
              <a href="tel:+201234567890" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" /> +20 123 456 7890
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <GitBranch className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-rose-line text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            © {new Date().getFullYear()} ThinkFirst. Built to fight brain rot. <Brain className="w-3 h-3" />
          </p>
        </div>
      </div>
    </footer>
  );
}
