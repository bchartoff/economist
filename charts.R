library(ggplot2)

data <- read.csv(file="data.csv")

View(data)

ggplot(subset(data,  sex == 'female'), aes(x=age, y=risk, group=model, color=model)) +
  geom_line()+
  facet_wrap(~ condition)+
  scale_x_continuous()+
  theme(axis.ticks = element_blank(), 
        )



ckd <- read.csv(file="ckd.csv")

View(ckd)

ggplot(subset(ckd,  sex == 'female'), aes(x=age, y=risk, group=model, color=model)) +
  geom_line()+
  facet_wrap(~ condition2)+
  scale_x_continuous()+
  theme(axis.ticks = element_blank(), 
        )


gridDf <- read.csv(file="grid")

View(gridDf)

ggplot(subset(gridDf,  sex == 'female'), aes(x=age, y=risk, group=model, color=model)) +
  geom_line()+
  facet_wrap(~ conditionLabel)+
  scale_x_continuous()+
  theme(axis.ticks = element_blank(), 
        )