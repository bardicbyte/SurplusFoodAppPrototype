// Random food images from Unsplash
// Using high-quality food photos for the prototype

const foodImages = {
    pasta: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center',
    salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center',
    iceCream: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&crop=center',
    pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
    fruitBowl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&crop=center',
    fishChips: 'https://images.unsplash.com/photo-1544551763-46a013bb2dcc?w=400&h=300&fit=crop&crop=center',
    teriyaki: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&crop=center',
    wrap: 'https://images.unsplash.com/photo-1565299585323-38174c4aabf0?w=400&h=300&fit=crop&crop=center',
    salmon: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center',
    yogurt: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
    cheesecake: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop&crop=center'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = foodImages;
}
