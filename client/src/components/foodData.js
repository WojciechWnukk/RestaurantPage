import pizza from "../images/pizza-margherita.jpg";
import spaghetti from "../images/spaghetti-bolognese.jpg";
import hamburger from "../images/Hamburger.jpg";
import salad from "../images/salad.jpg";
import iceCream from "../images/ice-cream.jpg";
import coffee from "../images/coffee.jpg";
import soup from "../images/soup.jpg";
import cake from "../images/cake.jpg";
import juice from "../images/juice.jpg";

const foodData = [
  {
    id: 1,
    name: "Pizza Margherita",
    image: pizza,
    price: "29.99 zł",
    category: "Dania główne"
  },
  {
    id: 2,
    name: "Spaghetti Bolognese",
    image: spaghetti,
    price: "34.99 zł",
    category: "Dania główne"
  },
  {
    id: 3,
    name: "Hamburger Bekon",
    image: hamburger,
    price: "24.99 zł",
    category: "Dania główne"
  },
  {
    id: 4,
    name: "Sałatka",
    image: salad,
    price: "19.99 zł",
    category: "Przystawki"
  },
  {
    id: 5,
    name: "Lody",
    image: iceCream,
    price: "12.99 zł",
    category: "Desery"
  },
  {
    id: 6,
    name: "Kawa",
    image: coffee,
    price: "9.99 zł",
    category: "Napoje"
  },
  {
    id: 7,
    name: "Zupa",
    image: soup,
    price: "14.99 zł",
    category: "Przystawki"
  },
  {
    id: 8,
    name: "Ciasto",
    image: cake,
    price: "16.99 zł",
    category: "Desery"
  },
  {
    id: 9,
    name: "Sok",
    image: juice,
    price: "6.99 zł",
    category: "Napoje"
  }
  // Dodaj więcej elementów według potrzeb
];

export default foodData;
