# Load the required library
library(readxl)

# Load the dataset
Prestige_New_excel <- read_excel("E:\\5014 BA Tharushi\\5014\\Prestige_New_excel.xlsx")


# Verify the dataset structure
str(Prestige_New_excel)

# View the dataset
View(Prestige_New_excel)


# Define a function to calculate mode
calculate_mode <- function(x) {
  uniq_x <- unique(x)
  uniq_x[which.max(tabulate(match(x, uniq_x)))]
}

# Calculate central tendency measures
prestige_mean <- mean(Prestige_New_excel$prestige, na.rm = TRUE)
prestige_median <- median(Prestige_New_excel$prestige, na.rm = TRUE)
prestige_mode <- calculate_mode(Prestige_New_excel$prestige)

education_mean <- mean(Prestige_New_excel$education, na.rm = TRUE)
education_median <- median(Prestige_New_excel$education, na.rm = TRUE)
education_mode <- calculate_mode(Prestige_New_excel$education)

income_mean <- mean(Prestige_New_excel$income, na.rm = TRUE)
income_median <- median(Prestige_New_excel$income, na.rm = TRUE)
income_mode <- calculate_mode(Prestige_New_excel$income)

# Print results
cat("Prestige - Mean:", prestige_mean, "Median:", prestige_median, "Mode:", prestige_mode, "\n")
cat("Education - Mean:", education_mean, "Median:", education_median, "Mode:", education_mode, "\n")
cat("Income - Mean:", income_mean, "Median:", income_median, "Mode:", income_mode, "\n")

# Load ggplot2 for visualization
library(ggplot2)

# Define the variables for plotting
variables <- list("Prestige" = Prestige_New_excel$prestige, 
                  "Education" = Prestige_New_excel$education, 
                  "Income" = Prestige_New_excel$income)

# Plot the bell curves
for (var_name in names(variables)) {
  var_data <- variables[[var_name]]
  
  # Create a data frame for ggplot
  plot_data <- data.frame(Value = var_data)
  
  # Plot the bell curve
  p <- ggplot(plot_data, aes(x = Value)) +
    geom_density(fill = "lightblue", alpha = 0.5) +
    geom_vline(aes(xintercept = mean(var_data, na.rm = TRUE)), color = "blue", linetype = "dashed", linewidth = 1) +
    geom_vline(aes(xintercept = median(var_data, na.rm = TRUE)), color = "red", linetype = "dotted", linewidth = 1) +
    labs(title = paste("Bell Curve for", var_name),
         x = var_name, 
         y = "Density") +
    theme_minimal()
  
  # Explicitly print the ggplot object
  print(p)
}


# Load ggplot2 for visualization
library(ggplot2)

# Plot bell curve for Prestige
ggplot(data = data.frame(Value = Prestige_New_excel$prestige), aes(x = Value)) +
  geom_density(fill = "lightblue", alpha = 0.5) +
  geom_vline(aes(xintercept = mean(Prestige_New_excel$prestige, na.rm = TRUE)), color = "blue", linetype = "dashed", linewidth = 1) +
  geom_vline(aes(xintercept = median(Prestige_New_excel$prestige, na.rm = TRUE)), color = "red", linetype = "dotted", linewidth = 1) +
  labs(title = "Bell Curve for Prestige",
       x = "Prestige",
       y = "Density") +
  theme_minimal()


# Plot bell curve for Education
ggplot(data = data.frame(Value = Prestige_New_excel$education), aes(x = Value)) +
  geom_density(fill = "lightgreen", alpha = 0.5) +
  geom_vline(aes(xintercept = mean(Prestige_New_excel$education, na.rm = TRUE)), color = "blue", linetype = "dashed", linewidth = 1) +
  geom_vline(aes(xintercept = median(Prestige_New_excel$education, na.rm = TRUE)), color = "red", linetype = "dotted", linewidth = 1) +
  labs(title = "Bell Curve for Education",
       x = "Education (Years)",
       y = "Density") +
  theme_minimal()


# Plot bell curve for Income
ggplot(data = data.frame(Value = Prestige_New_excel$income), aes(x = Value)) +
  geom_density(fill = "lightcoral", alpha = 0.5) +
  geom_vline(aes(xintercept = mean(Prestige_New_excel$income, na.rm = TRUE)), color = "blue", linetype = "dashed", linewidth = 1) +
  geom_vline(aes(xintercept = median(Prestige_New_excel$income, na.rm = TRUE)), color = "red", linetype = "dotted", linewidth = 1) +
  labs(title = "Bell Curve for Income",
       x = "Income",
       y = "Density") +
  theme_minimal()


