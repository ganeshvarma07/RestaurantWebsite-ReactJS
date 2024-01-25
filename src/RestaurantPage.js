import React, { useState, useEffect } from 'react';

const RestaurantPage = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'
        );
        const data = await response.json();
        setRestaurantData(data);
        setActiveCategory(
          data[0]?.table_menu_list[0]?.menu_category || null
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateTotalQuantity = () => {
    let totalQuantity = 0;

    for (const dishId in cart) {
      totalQuantity += cart[dishId];
    }

    return totalQuantity;
  };

  const handleIncrement = (dishId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      newCart[dishId] = (newCart[dishId] || 0) + 1;
      return newCart;
    });
  };

  const handleDecrement = (dishId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[dishId] && newCart[dishId] > 0) {
        newCart[dishId] -= 1;
      }
      return newCart;
    });
  };

  if (!restaurantData) {
    return <div>Loading...</div>;
  }

  const { restaurant_name, table_menu_list } = restaurantData[0];

  const cartCount = calculateTotalQuantity();

  return (
    <div>
      <h1>{restaurant_name || 'UNI Resto Cafe'}</h1>
      <header>
        <p>My Orders</p>
        {activeCategory === 'From the Barnyard' && (
          <p>Cart Count: {cartCount}</p>
        )}
      </header>
      <nav>
        {table_menu_list.map((category) => (
          <button
            key={category.menu_category_id}
            onClick={() =>
              setActiveCategory(category.menu_category)
            }
            className={
              activeCategory === category.menu_category
                ? 'active'
                : ''
            }
          >
            {category.menu_category}
          </button>
        ))}
      </nav>
      <section>
        {activeCategory &&
          table_menu_list
            .find(
              (category) =>
                category.menu_category === activeCategory
            )
            ?.category_dishes.map((dish) => (
              <div key={dish.dish_id}>
                <h2>{dish.dish_name}</h2>
                <p>{`${dish.dish_currency} ${dish.dish_price}`}</p>
                <p>{dish.dish_description}</p>
                <p>{`${dish.dish_calories} calories`}</p>
                <img
                  src={dish.dish_image}
                  alt={dish.dish_name}
                />
                {dish.dish_Availability ? (
                  <div>
                    <button
                      onClick={() =>
                        handleDecrement(dish.dish_id)
                      }
                    >
                      -
                    </button>
                    <p>{cart[dish.dish_id] || 0}</p>
                    <button
                      onClick={() =>
                        handleIncrement(dish.dish_id)
                      }
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <p>Not available</p>
                )}
                {dish.addonCat &&
                  dish.addonCat.length > 0 &&
                  activeCategory === 'Fast Food' && (
                    <p>Customizations available</p>
                  )}
              </div>
            ))}
      </section>
      <div>
        <p>{cartCount}</p>
      </div>
    </div>
  );
};

export default RestaurantPage;
