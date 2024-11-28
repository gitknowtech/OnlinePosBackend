# Load necessary libraries
library(readxl)
library(ggplot2)

# Load the dataset
Prestige_New_excel <- read_excel("E:\\5014 BA Tharushi\\5014\\Prestige_New_excel.xlsx")

# Inspect the structure of the dataset
str(Prestige_New_excel)

# View the first few rows
head(Prestige_New_excel)


sum(is.na(Prestige_New_excel$prestige))
sum(is.na(Prestige_New_excel$type))
Prestige_New_excel$type <- as.factor(Prestige_New_excel$type)


# Perform ANOVA
anova_result <- aov(prestige ~ type, data = Prestige_New_excel)

# View ANOVA summary
summary(anova_result)


# Perform ANOVA
anova_result <- aov(prestige ~ type, data = Prestige_New_excel)

# View ANOVA summary
summary(anova_result)


# Perform Tukey HSD test
tukey_result <- TukeyHSD(anova_result)

# View Tukey test results
print(tukey_result)





# Box plot for Prestige by Occupation Type
ggplot(Prestige_New_excel, aes(x = type, y = prestige, fill = type)) +
  geom_boxplot(alpha = 0.7, outlier.color = "red", outlier.size = 2) +
  labs(title = "Prestige Scores by Occupation Type",
       x = "Occupation Type",
       y = "Prestige Score") +
  theme_minimal() +
  theme(legend.position = "none")























