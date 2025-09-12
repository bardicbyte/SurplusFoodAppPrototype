// Random food images from Unsplash
// Using high-quality food photos for the prototype

const foodImages = {
    pasta: 'https://media.istockphoto.com/id/1457259411/photo/table-full-of-various-fresh-food-in-luxury-modern-restaurant.jpg?s=612x612&w=0&k=20&c=rr8CnHnichrgFS3AFNEKjTGJeNDw16r_FA1PPF2fAyg=',
    salad: 'https://media.istockphoto.com/id/1294939955/photo/valentines-or-mothers-day-breakfast-table-scene-on-a-dark-wood-background-with-heart-shaped.jpg?s=612x612&w=0&k=20&c=SGlRQunjMg0GV6aDr0bbnRYDXHbpHY15NXxGuv5vcH4=',
    iceCream: 'https://media.istockphoto.com/id/903764150/photo/fried-eggs-sunny-side-up-on-baguette-ham-and-arugula.jpg?s=612x612&w=0&k=20&c=u-3UKbgAWuGh4VdQTP8XtY0SN-AfpJul97h7OqAh8kc=',
    pizza: 'https://media.istockphoto.com/id/1795744550/photo/brunch-table.jpg?s=612x612&w=is&k=20&c=Cw03mwYiGDE055Pq2xLPkwpwrxP2D7d2I1zZPl-_pvM=',
    fruitBowl: 'https://media.istockphoto.com/id/1175195842/photo/french-toast-brioche-sandwich-with-pastrami-and-sun-dried-tomatoes-light-morning-breakfast.jpg?s=612x612&w=0&k=20&c=b522WpwPItEWEaRynzMlWvmTKVEe5vdNpwzSWKd7FJ0=',
    fishChips: 'https://media.istockphoto.com/id/1457259411/photo/table-full-of-various-fresh-food-in-luxury-modern-restaurant.jpg?s=612x612&w=0&k=20&c=rr8CnHnichrgFS3AFNEKjTGJeNDw16r_FA1PPF2fAyg=',
    teriyaki: 'https://media.istockphoto.com/id/1294939955/photo/valentines-or-mothers-day-breakfast-table-scene-on-a-dark-wood-background-with-heart-shaped.jpg?s=612x612&w=0&k=20&c=SGlRQunjMg0GV6aDr0bbnRYDXHbpHY15NXxGuv5vcH4=',
    wrap: 'https://media.istockphoto.com/id/903764150/photo/fried-eggs-sunny-side-up-on-baguette-ham-and-arugula.jpg?s=612x612&w=0&k=20&c=u-3UKbgAWuGh4VdQTP8XtY0SN-AfpJul97h7OqAh8kc=',
    salmon: 'https://media.istockphoto.com/id/1795744550/photo/brunch-table.jpg?s=612x612&w=is&k=20&c=Cw03mwYiGDE055Pq2xLPkwpwrxP2D7d2I1zZPl-_pvM=',
    yogurt: 'https://media.istockphoto.com/id/1175195842/photo/french-toast-brioche-sandwich-with-pastrami-and-sun-dried-tomatoes-light-morning-breakfast.jpg?s=612x612&w=0&k=20&c=b522WpwPItEWEaRynzMlWvmTKVEe5vdNpwzSWKd7FJ0=',
    cheesecake: 'https://media.istockphoto.com/id/1457259411/photo/table-full-of-various-fresh-food-in-luxury-modern-restaurant.jpg?s=612x612&w=0&k=20&c=rr8CnHnichrgFS3AFNEKjTGJeNDw16r_FA1PPF2fAyg='
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = foodImages;
}
