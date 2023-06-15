import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  InputLabel,
  Container,
  Box,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/";

function Home() {
  const [drinks, setDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (selectedCategory === "") {
          response = await axios.get(`${API_URL}search.php?s=`);
        } else {
          response = await axios.get(
            `${API_URL}filter.php?c=${selectedCategory}`
          );
        }
        setDrinks(response.data.drinks || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}list.php?c=list`);
        setCategories(response.data.drinks || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Typography variant="h2" component="h1" gutterBottom>
          Cardápio de Drinks
        </Typography>
        <FormControl sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel>Categoria</InputLabel>
          <Select value={selectedCategory} onChange={handleCategoryChange}>
            <MenuItem value="">Todos</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.strCategory} value={category.strCategory}>
                {category.strCategory}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        {drinks.length > 0 ? (
          drinks.map((drink) => (
            <Grid item xs={12} sm={6} md={4} key={drink.idDrink}>
              <Card>
                <CardActionArea component={Link} to={`/drink/${drink.idDrink}`}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={drink.strDrinkThumb}
                    alt={drink.strDrink}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {drink.strDrink}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {drink.strCategory}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Box my={4} textAlign="center" width="100%">
            <CircularProgress />
          </Box>
        )}
      </Grid>
    </Container>
  );
}

function DrinkDetails({ match }) {
  const [drink, setDrink] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}lookup.php?i=${match.params.id}`
        );
        setDrink(response.data.drinks[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [match.params.id]);

  return (
    <Container>
      {drink ? (
        <Box my={4} textAlign="center">
          <Typography variant="h2" component="h1" gutterBottom>
            {drink.strDrink}
          </Typography>
          <img
            src={drink.strDrinkThumb}
            alt={drink.strDrink}
            style={{ marginBottom: 20 }}
          />
          <Typography variant="h4" component="h2" gutterBottom>
            Ingredientes:
          </Typography>
          <ul>
            {Object.entries(drink)
              .filter(
                ([key, value]) => key.startsWith("strIngredient") && value
              )
              .map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
          </ul>
          <Typography variant="h4" component="h2" gutterBottom>
            Modo de fazer:
          </Typography>
          <Typography variant="body1">{drink.strInstructions}</Typography>
        </Box>
      ) : (
        <Box my={4} textAlign="center">
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/drink/:id" component={DrinkDetails} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
