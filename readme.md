## Aurora ![Aurora Icon](./favicon-32x32.png)

Aurora is a web application that helps to find the best locations for observing the Aurora Borealis in Great Britain. The map shows locations where our users observed this magnificent phenomenon. You can click on the pins on the map to check the date, time, exact coordinates for the location and the total number of observations registered at that point by our community.

To help you plan the best Northern Lights experience, we provide you with a weather forecast and the preditctions how likely it is to see an Aurora.

## Features

- View locations where Aurora was spotted by others on the map.
- Get the latest Aurora forecast.
- Get the weather forecast for the chosen location.
- Register in the system.
- Tag a location where Aurora was observed.
- View the observation diary.

### Feature: Upload Photos

When users register, they can upload a profile photo (which is stored on the server via Multer and resized using Sharp.) Their photo is then displayed on their profile by storing the filepath in a MongoDB database and displayed on the front-end using EJS templating.

When recording their observations, users can also upload a photo of the aurora which is then shown on the observation map popup and in their observation profile. If they chose not upload a photo, a default one is provided.

## Demo Photos

![Aurora Observation Map](https://louisefindlay.com/img/aurora-mockup-1.png)

![Profile and Aurora Observation Diary](https://louisefindlay.com/img/aurora-mockup-2.png)

## Technologies Used

The project was first developed as a static site and then converted into a dynamic site with a Node.js backend.

The static site is contained in the prototype folder and the dynamic site in the final folder.

### Prototype: Front-End

The first version of the site used hard-coded content and a login system stored in the browser's LocalStorage.

#### Languages Used

HTML5, CSS3 & JavaScript

#### Libraries Used

jQuery, Leaflet Maps, Mapbox, CryptoJS & Font Awesome

### Final: Back-End

The final version of the site uses a NodeJS backend and EJS template engine, served by Express to create a dynamic version of the Aurora website. The login system is replaced by a more secure MongoDB database, the (previously static) content is created through EJS pages and partials and images can be uploaded.

#### Plugins Used

Express, MongoDB, Multer & Path

## API Reference

[Leaflet Map API](https://leafletjs.com/)\
[OpenWeatherMap API](https://openweathermap.org/api)\
[AuroraWatch UK API](https://aurorawatch.lancs.ac.uk/api-info/)

## Collaborators

Louise Findlay (Full-Stack) = [@louisefindlay23](https://github.com/louisefindlay23)

Brandon Reid (Design) = [@brandonreid11](https://github.com/brandonreid11)

Miriam Wojcik (Back-End) = [@mijamka](https://github.com/mijamka)

Maya Bonazarova (Back-End) = [@mayabonaz](https://github.com/mayabonaz)

## Useful Links  :link:

Website - [Final](https://auroraspotter.space)

Project Management - [Glo Boards](https://app.gitkraken.com/glo/board/XkEAXQ6McgARAiGj)
