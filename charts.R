
# Facet grid of data death and hospitalization risk for women, all conditions
library(ggplot2)

data <- read.csv(file="data.csv")

View(data)

ggplot(subset(data,  sex == 'female'), aes(x=age, y=risk, group=model, color=model)) +
  geom_line()+
  facet_wrap(~ condition)+
  scale_x_continuous()+
  theme(axis.ticks = element_blank(), 
        )



# Facet grid of data death and hospitalization risk for women, all conditions paired with CKD
ckd <- read.csv(file="ckd.csv")

View(ckd)

ggplot(subset(ckd,  sex == 'female'), aes(x=age, y=risk, group=model, color=model)) +
  geom_line()+
  facet_wrap(~ condition2)+
  scale_x_continuous()+
  theme(axis.ticks = element_blank(), 
        )


# Facet grid of data death and hospitalization risk for women, all 2 condition permutations. Since this is symetrical across the diagonal, I popped it into illustrator and deleted the redundant 1/2 of it
gridDf <- read.csv(file="grid.csv")

View(gridDf)

ggplot(subset(gridDf,  sex == 'female'), aes(x=age, y=risk, group=model, color=model)) +
  geom_line()+
  facet_wrap(~ conditionLabel)+
  scale_x_continuous()+
  theme(axis.ticks = element_blank(), 
        )