# Load the necessary library
library(readxl)

# Load the dataset
Prestige_New_excel <- read_excel("E:\\5014 BA Tharushi\\5014\\Prestige_New_excel.xlsx")

# Inspect the structure of the dataset
str(Prestige_New_excel)

# View the dataset
head(Prestige_New_excel)


# Perform Pearson Correlation Test
correlation_test <- cor.test(Prestige_New_excel$prestige, Prestige_New_excel$education, method = "pearson")

# Print the results
print(correlation_test)


# Load ggplot2 for visualization
library(ggplot2)

# Create a scatter plot with regression line
ggplot(Prestige_New_excel, aes(x = education, y = prestige)) +
  geom_point(color = "blue", alpha = 0.6) +
  geom_smooth(method = "lm", se = TRUE, color = "red", linetype = "dashed") +
  labs(title = "Relationship Between Education and Prestige",
       x = "Education (Years)",
       y = "Prestige") +
  theme_minimal()
