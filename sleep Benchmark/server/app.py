# server/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Allows your frontend to make requests to this server

# --- Load all the model components ---
try:
    model = joblib.load('model.pkl')
    preprocessor = joblib.load('preprocessor.pkl')
    label_encoder = joblib.load('label_encoder.pkl')
    print("Model and helper files loaded successfully.")
except FileNotFoundError as e:
    print(f"Error loading model files: {e}")
    model = preprocessor = label_encoder = None


@app.route('/predict', methods=['POST'])
def predict():
    if not all([model, preprocessor, label_encoder]):
        return jsonify({'error': 'Model components not loaded properly.'}), 500

    # Get the JSON data from the frontend
    data = request.get_json()
    
    # --- THIS IS THE UPDATED PART ---
    # Create a pandas DataFrame, ensuring the column order and names are correct.
    try:
        input_df = pd.DataFrame([data], columns=[
            'Gender', 'Age', 'Occupation', 'Sleep Duration', 'Quality of Sleep', 
            'Physical Activity Level', 'Stress Level', 'BMI Category', 
            'Heart Rate', 'Daily Steps', 'Systolic', 'Diastolic'
        ])
    except Exception as e:
        return jsonify({'error': f'Error creating DataFrame: {e}'}), 400
    
    # 1. Preprocess the data using the loaded preprocessor
    processed_features = preprocessor.transform(input_df)
    
    # 2. Make a prediction using the loaded model
    prediction_numeric = model.predict(processed_features)
    
    # 3. Convert the numeric prediction back to a readable label
    prediction_label = label_encoder.inverse_transform(prediction_numeric)
    
    # Return the final readable prediction
    return jsonify({'sleep_disorder_prediction': prediction_label[0]})

if __name__ == '__main__':
    # Run the Flask app on a different port than your Express server
    app.run(port=5001, debug=True)