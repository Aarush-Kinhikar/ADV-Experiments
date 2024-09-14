library(ggplot2)
library(dplyr)
library(reshape2)
library(rgl)
library(wordcloud)
library(tm)
library(tidyr)
library(readr)

data <- read_csv("D:/ADV Experiments/Experiment 4/Crime_Reports.csv")

# Bar chart: Crime count per neighborhood
ggplot(data, aes(x = Neighborhood)) +
  geom_bar(fill = "blue") +
  theme(axis.text.x = element_text(angle = 90, hjust = 1)) +
  labs(title = "Crime Count per Neighborhood", x = "Neighborhood", y = "Count")

# Pie chart: Crime type distribution
crime_type_count <- table(data$Crime)
pie(crime_type_count, main = "Crime Type Distribution", col = rainbow(length(crime_type_count)))

# Convert 'Date of Report' to a proper date-time format
data$`Date of Report` <- as.POSIXct(data$`Date of Report`, format = "%m/%d/%Y %I:%M:%S %p")

# Histogram: Distribution of crime reports over time
ggplot(data, aes(x = `Date of Report`)) +
  geom_histogram(binwidth = 30*24*60*60, fill = "green", color = "black") +  # binwidth in seconds (30 days)
  labs(title = "Distribution of Crime Reports Over Time", x = "Date", y = "Count") +
  scale_x_datetime(date_labels = "%b %Y", date_breaks = "6 months")  # Customizing date labels


# Convert 'Date of Report' to a proper date-time format (if not already done)
data$`Date of Report` <- as.POSIXct(data$`Date of Report`, format = "%m/%d/%Y %I:%M:%S %p")

# Timeline chart: Crime incidents over time
ggplot(data, aes(x = `Date of Report`)) +
  geom_freqpoly(binwidth = 30*24*60*60, color = "red") +  # binwidth in seconds (30 days)
  labs(title = "Timeline of Crime Incidents", x = "Date", y = "Count") +
  scale_x_datetime(date_labels = "%b %Y", date_breaks = "6 months")  # Customizing date labels

# Scatter plot: Reporting area vs Crime count
crime_count_by_area <- as.data.frame(table(data$`Reporting Area`))
colnames(crime_count_by_area) <- c("ReportingArea", "CrimeCount")

ggplot(crime_count_by_area, aes(x = as.numeric(ReportingArea), y = CrimeCount)) +
  geom_point(color = "purple") +
  labs(title = "Reporting Area vs Crime Count", x = "Reporting Area", y = "Crime Count")

# Bubble plot: Crime types by reporting area
crime_type_area <- as.data.frame(table(data$Crime, data$`Reporting Area`))
colnames(crime_type_area) <- c("CrimeType", "ReportingArea", "Count")

ggplot(crime_type_area, aes(x = as.numeric(ReportingArea), y = CrimeType, size = Count)) +
  geom_point(alpha = 0.6, color = "blue") +
  labs(title = "Bubble Plot of Crime Types by Reporting Area", x = "Reporting Area", y = "Crime Type")

ggplot(data, aes(x = Crime)) +
  +     geom_bar(fill = "green") +
  +     theme(axis.text.x = element_text(angle = 90, hjust = 1)) +
  +     labs(title = "Crime Count", x = "Type of Crime", y = "Count")
