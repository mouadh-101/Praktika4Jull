from flask import Flask, request, jsonify
import requests
import traceback

app = Flask(__name__)

# Forefront API Config
FOREFRONT_API_URL = "https://api.forefront.ai/v1/chat/completions"
FOREFRONT_API_KEY = "sk-fMDJIwLQexvki4g8XUX7MlBeFthcWAaS"  # Preferably use env variable in production

def call_forefront_api(prompt):
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.1",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 50,
        "temperature": 0.5,
    }

    headers = {
        "content-type": "application/json",
        "authorization": f"Bearer {FOREFRONT_API_KEY}"
    }

    try:
        print(f"Sending request to API with payload: {payload}")  # Debug: print payload
        response = requests.post(FOREFRONT_API_URL, json=payload, headers=headers)
        print(f"API Response Status Code: {response.status_code}")  # Debug: print status code
        
        # Print the full response text to debug
        print(f"API Response Text: {response.text}")
        
        # Check if response is successful
        response.raise_for_status()
        
        # Print the actual response JSON for debugging
        response_json = response.json()
        print(f"API Response JSON: {response_json}")
        
        return response_json["choices"][0]["message"]["content"]
    
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        raise e  # Re-raise the exception to handle it later
    except Exception as e:
        print(f"General error: {e}")
        print(traceback.format_exc())  # Print the full traceback for debugging
        raise e  # Re-raise the exception to handle it later

@app.route("/analyze", methods=["POST"])
def analyze_application():
    try:
        data = request.get_json()

        # Ensure necessary data is provided in the request
        if not data or "student" not in data or "internship" not in data or "coverLetter" not in data:
            return "Missing required fields: 'student', 'internship', or 'coverLetter'", 400

        print(f"Received request data: {data}")  # Debug: print incoming data

        # Student Rating Prompt
        student_rating_prompt = f"""
        You are an AI evaluating a student's profile for an internship. Given the following student information:
        {data["student"]}
        Rate the student's profile from 0 to 100 based on how well it aligns with the internship.
        """

        # Profile Strength Score Prompt
        profile_strength_score_prompt = f"""
        You are an AI evaluating a student's profile strength for an internship. Given the following student information:
        {data["student"]}
        Break down the student's strengths in these areas (out of 100 each):
        - Technical skills
        - Experience
        - Education
        - Extra-curricular activities
        """

        # Hiring Probability Prompt
        hiring_probability_prompt = f"""
        You are an AI evaluating a student's hiring probability for an internship. Given the following student information:
        {data["student"]}
        And the internship details:
        {data["internship"]}
        Provide the probability (in percentage) that this student will be hired.
        """

        # Advice to Improve Chances Prompt
        advice_prompt = f"""
        You are an AI evaluating a student's profile for an internship. Given the following student information:
        {data["student"]}
        Provide specific advice to improve the student's chances of getting hired.
        """

        # Cover Letter Feedback Prompt
        cover_letter_feedback_prompt = f"""
        You are an AI evaluating a student's cover letter for an internship. Given the following student information:
        {data["student"]}
        And the student's cover letter:
        {data["coverLetter"]}
        Provide personalized feedback on the student's cover letter.
        """

        # Call API for each feature separately and return their responses
        student_rating = call_forefront_api(student_rating_prompt)
        profile_strength_score = call_forefront_api(profile_strength_score_prompt)
        hiring_probability = call_forefront_api(hiring_probability_prompt)
        advice = call_forefront_api(advice_prompt)
        cover_letter_feedback = call_forefront_api(cover_letter_feedback_prompt)
        profile_strength_score_list = []
        if profile_strength_score:
            # Example: Splitting the returned text into areas
            profile_parts = profile_strength_score.split("\n")
            for part in profile_parts:
                if part.strip():  # Avoid adding empty strings
                    profile_strength_score_list.append(part.strip())

        result = {
            "studentRating": student_rating,
            "profileStrengthScore": profile_strength_score_list,
            "hiringProbability": hiring_probability,
            "adviceToImproveChances": advice,
            "coverLetterFeedback": cover_letter_feedback
        }

        return jsonify(result)

    except Exception as e:
        print(f"Error in /analyze endpoint: {e}")
        print(traceback.format_exc())
        return "Internal Server Error", 500

    
@app.route("/hello", methods=["POST"])
def hello():
    try:
        # Get the JSON payload from the request
        data = request.get_json()

        # Ensure 'message' is present in the JSON payload
        if not data or "message" not in data:
            return jsonify({"error": "Missing 'message' field in JSON payload"}), 400

        # Extract the message
        message = data["message"]

        # Call the LLM with the provided message
        llm_response = call_forefront_api(message)

        # Return the LLM's response
        return jsonify({"response": llm_response})

    except Exception as e:
        print(f"Error in /hello endpoint: {e}")
        print(traceback.format_exc())  # Print full stack trace for debugging
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
