library(ggplot2)
library(dplyr)
library(reshape2)
library(rgl)
library(wordcloud)
library(tm)
library(tidyr)
library(readr)

head(housing_data)
str(housing_data)

ggplot(housing_data, aes(x=furnishingstatus)) +
  geom_bar(fill="skyblue") +
  theme_minimal() +
  labs(title="Furnishing Status Count", x="Furnishing Status", y="Count")

ggplot(housing_data, aes(x=furnishingstatus, y=price)) +
  geom_boxplot(fill="lightgreen") +
  theme_minimal() +
  labs(title="Price Distribution by Furnishing Status", x="Furnishing Status", y="Price")

ggplot(housing_data, aes(x=furnishingstatus, y=price)) +
  geom_violin(fill="lightblue") +
  theme_minimal() +
  labs(title="Price Distribution by Furnishing Status (Violin Plot)", x="Furnishing Status", y="Price")

ggplot(housing_data, aes(x=area, y=price)) +
  geom_point() +
  geom_smooth(method="lm", col="blue") +
  theme_minimal() +
  labs(title="Linear Regression: Price vs Area", x="Area", y="Price")

ggplot(housing_data, aes(x=area, y=price)) +
  geom_point() +
  geom_smooth(method="loess", col="red") +
  theme_minimal() +
  labs(title="Nonlinear Regression (LOESS): Price vs Area", x="Area", y="Price")

with(housing_data, plot3d(area, bedrooms, price, col="blue", size=3, type="s"))

ggplot(housing_data, aes(x=furnishingstatus, y=parking)) +
  geom_jitter(width=0.2, height=0.2, color="purple") +
  theme_minimal() +
  labs(title="Jitter Plot: Furnishing Status vs Parking", x="Furnishing Status", y="Parking Spaces")

