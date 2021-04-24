library(ggplot2)

# Load the csv from previous tutorial

data <- read.csv(file="data.csv")

# View the dataset in RStudio (note the capital V)

View(data)

ggplot(subset(data, model == 'hospitalisationrisk'), aes(x=age, y=risk, group=condition, color=condition)) +
  geom_line()+
  facet_wrap(~ city)+
  scale_x_continuous()+
  theme(axis.ticks = element_blank(), 
        axis.text.x = element_blank(),
        legend.position = "none"
        )
