# Lezter DSAI Test

## Convolution

<https://poloclub.github.io/cnn-explainer/>

### Warum Max-Pooling?

Max-Pooling ist quasi downsampling, um Rechenpower zu sparen.

### Fully Connected Layer

Fully Connected Layer sind quasi die "klassischen" Neuronalen Netze, wo jedes Neuron mit jedem anderen verbunden ist. Sie sind nicht mehr so effizient wie Convolutional Neural Networks, da sie viele Parameter haben und somit mehr Rechenpower benötigen.


#### Warum Resitial Connections?

Resitial Connections sind quasi Verbindungen, die es ermöglichen, dass Informationen von früheren Schichten direkt zu späteren Schichten weitergegeben werden können. Dies ermöglicht es, dass Informationen nicht verloren gehen und somit die Leistung des Netzes verbessert wird. Es hilft auch, das Problem des Vanishing Gradient zu lösen, da die Gradienten direkt durch die Resitial Connections weitergegeben werden können.

Gradienten sind quasi die Ableitungen der Fehlerfunktion, die verwendet werden, um die Gewichte des Netzes zu aktualisieren. Wenn die Gradienten zu klein werden, kann es passieren, dass die Gewichte nicht mehr aktualisiert werden und somit das Netz nicht mehr lernt. Resitial Connections helfen dabei, dass die Gradienten nicht zu klein werden und somit das Netz weiterhin lernen kann.

## Transformers

### Feed-Forward Neural Networks

Feed-Forward Neural Networks sind quasi die "klassischen" Neuronalen Netze, wo jedes Neuron mit jedem anderen verbunden ist. Sie sind nicht mehr so effizient wie Convolutional Neural Networks, da sie viele Parameter haben und somit mehr Rechenpower benötigen. 

### Feed-Forward Neural Networks in Transformers

- Paper hat belegt, dass wenn Transformers Fakten speichern machen sie das meist im Feed-Forward Neural Network
- letzter layer (nach Attention) ist quasi ein Feed-Forward Neural Network, das die Informationen verarbeitet und weitergibt
