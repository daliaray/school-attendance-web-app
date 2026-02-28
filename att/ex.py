
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
for student_id, student_data in data.groupby('student_id'):
    student_data = student_data.sort_values('date')
    for i in range(len(student_data) - sequence_length):
        X.append(student_data['status'].values[i:i+sequence_length])
        y.append(student_data['semaine_encoded'].values[i+sequence_length])

# Conversion des listes en tableaux numpy
X = np.array(X)
y = np.array(y)

# Division des données en ensembles d'entraînement, de validation et de test
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

# Création du modèle LSTM
model = Sequential()
model.add(LSTM(units=50, input_shape=(sequence_length, 1)))  # Couche LSTM avec 50 unités
model.add(Dense(3, activation='softmax'))  # Couche Dense avec 3 unités et activation softmax pour la classification

# Compilation du modèle avec une fonction de perte, un optimiseur et des métriques
model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# Mise en place de l'arrêt anticipé pour éviter le surapprentissage
early_stopping = EarlyStopping(monitor='val_loss', patience=5)

# Entraînement du modèle avec un nombre d'époques limité
model.fit(X_train, y_train, epochs=20, batch_size=32, validation_data=(X_val, y_val), callbacks=[early_stopping])

# Évaluation du modèle sur l'ensemble de test
test_loss, test_accuracy = model.evaluate(X_test, y_test)
print(f'Test Loss: {test_loss:.4f}, Test Accuracy: {test_accuracy:.4f}')

# Utilisation du modèle pour faire des prédictions
future_sequence = np.array([[0, 1, 0, 1]])  # Séquence future (0 pour absent, 1 pour présent)
predicted_probabilities = model.predict(future_sequence)
predicted_label = np.argmax(predicted_probabilities, axis=-1)
predicted_category = label_encoder.inverse_transform(predicted_label)
print(f'Predicted Category for Future Week: {predicted_category[0]}')

