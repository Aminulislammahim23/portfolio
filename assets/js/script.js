// Navbar scroll effect
        function initNavbar() {
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 20) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
        
        // Mobile menu
        function toggleMobileMenu() {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = '1px solid #e5e7eb';
            }
        }
        
        // Contact modal
        function showContactModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <h3 style="font-size: 24px; font-weight: 700;">Let's talk</h3>
                        <button onclick="this.closest('.modal').remove()" style="font-size: 28px; background: none; border: none; cursor: pointer; color: #9ca3af;">×</button>
                    </div>
                    
                    <form onsubmit="submitContactForm(event)">
                        <div class="form-group">
                            <label>Your name</label>
                            <input type="text" required placeholder="Jane Doe">
                        </div>
                        <div class="form-group">
                            <label>Email address</label>
                            <input type="email" required placeholder="jane@company.com">
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea required placeholder="Hi Mahim, I'd love to chat about..."></textarea>
                        </div>
                        
                        <div style="display: flex; gap: 12px; margin-top: 24px;">
                            <button type="button" onclick="this.closest('.modal').remove()" class="btn btn-outline" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">Send message</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        function submitContactForm(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending...';
            btn.disabled = true;
            
            setTimeout(function() {
                btn.innerHTML = '✓ Sent!';
                btn.style.background = '#16a34a';
                
                setTimeout(function() {
                    const modal = btn.closest('.modal');
                    if (modal) modal.remove();
                    
                    // Toast
                    const toast = document.createElement('div');
                    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translate(-50%,0);background:#1f2937;color:white;padding:16px 24px;border-radius:9999px;display:flex;align-items:center;gap:10px;font-size:15px;box-shadow:0 10px 15px rgba(0,0,0,0.2);';
                    toast.innerHTML = '✓ Thanks! I\'ll reply within 24 hours.';
                    document.body.appendChild(toast);
                    
                    setTimeout(function() {
                        toast.style.transition = 'all 0.3s';
                        toast.style.opacity = '0';
                        setTimeout(function() {
                            toast.remove();
                        }, 300);
                    }, 3800);
                }, 1200);
            }, 1600);
        }
        
        // Smooth scroll for nav links
        function initSmoothScroll() {
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        }
        
        // Initialize everything
        function init() {
            initNavbar();
            initSmoothScroll();
            
            // Make mobile button visible on small screens
            const mobileBtn = document.getElementById('mobile-btn');
            if (mobileBtn) {
                mobileBtn.style.display = window.innerWidth < 768 ? 'inline-flex' : 'none';
            }
            
            window.addEventListener('resize', function() {
                if (mobileBtn) {
                    mobileBtn.style.display = window.innerWidth < 768 ? 'inline-flex' : 'none';
                }
            });
            
            console.log('%c[Portfolio] Pure HTML/CSS/JS portfolio loaded successfully.', 'color:#64748b');
        }
        
        window.onload = init;