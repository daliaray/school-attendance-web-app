
# Importation des bibliothèques nécessaires
import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import EarlyStopping

# Chargement des données à partir d'un fichier CSV
data = pd.read_csv('attendance_data.csv')
# Définition de la longueur de la séquence (nombre de semaines passées à considérer pour la prédiction future)
sequence_length = 4
# Conversion des étiquettes de 'semaine' en labels numériques
label_encoder = LabelEncoder()
data['semaine_encoded'] = label_encoder.fit_transform(data['semaine'])
# Préparation des séquences et des étiquettes
X = []
y = []
# Boucle sur chaque étudiant
# Conversion des listes en tableaux numpy
# Division des données en ensembles d'entraînement, de validation et de test
# Création du modèle LSTM
model = Sequential()
model.add(LSTM(units=50, input_shape=(sequence_length, 1)))  # Couche LSTM avec 50 unités
model.add(Dense(3, activation='softmax'))  # Couche Dense avec 3 unités et activation softmax pour la classification
# Compilation du modèle avec une fonction de perte, un optimiseur et des métriques
model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
# Entraînement du modèle avec un nombre d'époques limité
# Évaluation du modèle sur l'ensemble de test
# Utilisation du modèle pour faire des prédictions
future_sequence = np.array([[0, 1, 0, 1]])  # Séquence future (0 pour absent, 1 pour présent)
predicted_probabilities = model.predict(future_sequence)
predicted_label = np.argmax(predicted_probabilities, axis=-1)
predicted_category = label_encoder.inverse_transform(predicted_label)
print(f'Predicted Category for Future Week: {predicted_category[0]}')

