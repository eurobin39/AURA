from flask import Flask, request, jsonify

app = Flask(__name__)

# Route to receive analyzed face data
@app.route('/face-analysis', methods=['POST'])
def receive_face_data():
    data = request.json  # Get JSON data from request
    print("📥 Received Face Data:", data)

    # TODO: Save data to a database (Optional)
    
    return jsonify({"message": "Data received successfully"}), 200

# Run the server
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Runs on http://127.0.0.1:5001
