# zk-covid
A zero-knowledge machine learning project utilising COVID patient data, created as part of the ETHGlobal Circuit Breaker event.

The project is based around a machine learning model trained on COVID patient data, intended to predict which patients are at high risk of severe illness. The target label is aggregated from three separate measures included in the original data - ICU admission, intubation and death - such that patients suffering any of these outcomes in the training set are labeled as "severe". The project webpage enables patient data to be submitted, a result of "high risk" or "unspecified risk" to be given , a zk-SNARK proof to be generated and a verification to be performed on the proof.

The model was trained using Python, and specifically uses the multilayer perceptron classifier (a rudimentary neural network) from Scikit-Learn. The data, sourced from Kaggle, are derived from a study by the Mexican government. The trained model was then implemented in the Noir language, and the Sindri API used for proof generation. Proof verification is performed natively within Noir.
