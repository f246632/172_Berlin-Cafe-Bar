/**
 * Berlin Cafe Bar - Gallery Lightbox
 * Handles image gallery and lightbox functionality
 */

// ============================================
// Gallery Lightbox
// ============================================

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImageIndex = 0;
const galleryImages = [];

// Collect all gallery images
galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
        galleryImages.push({
            src: img.src,
            alt: img.alt || `Gallery image ${index + 1}`
        });
    }
});

// Open lightbox
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        openLightbox(index);
    });
});

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function updateLightboxImage() {
    if (galleryImages[currentImageIndex]) {
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxImage.alt = galleryImages[currentImageIndex].alt;
    }
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

// Event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNextImage);
lightboxPrev.addEventListener('click', showPrevImage);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
    }
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - show next image
            showNextImage();
        } else {
            // Swiped right - show previous image
            showPrevImage();
        }
    }
}

// ============================================
// Gallery Hover Effects
// ============================================

galleryItems.forEach(item => {
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay');

    item.addEventListener('mouseenter', () => {
        overlay.style.opacity = '1';
        img.style.transform = 'scale(1.1)';
    });

    item.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
        img.style.transform = 'scale(1)';
    });
});

// ============================================
// Gallery Loading Animation
// ============================================

// Add staggered fade-in animation for gallery items
document.addEventListener('DOMContentLoaded', () => {
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';

        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100); // Stagger by 100ms
    });
});

// ============================================
// Image Preloading for Better Performance
// ============================================

function preloadImages() {
    galleryImages.forEach(imageData => {
        const img = new Image();
        img.src = imageData.src;
    });
}

// Preload images after page load
window.addEventListener('load', () => {
    setTimeout(preloadImages, 1000);
});

// ============================================
// Gallery Intersection Observer
// ============================================

const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            galleryObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

galleryItems.forEach(item => {
    galleryObserver.observe(item);
});

// Add CSS for in-view animation
const galleryStyle = document.createElement('style');
galleryStyle.textContent = `
    .gallery-item {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .gallery-item.in-view {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .lightbox {
        cursor: zoom-out;
    }

    .lightbox-content {
        cursor: default;
    }

    .lightbox-content img {
        cursor: grab;
    }

    .lightbox-content img:active {
        cursor: grabbing;
    }
`;
document.head.appendChild(galleryStyle);

// ============================================
// Console Log
// ============================================

console.log('%c Gallery Module Loaded ', 'background: #e67e22; color: white; padding: 5px; border-radius: 3px;');
console.log(`Gallery contains ${galleryImages.length} images`);
