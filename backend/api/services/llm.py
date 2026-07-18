import os
import google.generativeai as genai
import openai

def generate_process_summary(title, drafts, reflection=""):
    """
    Calls Gemini (or OpenAI as fallback) to generate a short paragraph summarizing
    the essay's evolution across the provided list of drafts.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if not gemini_key and not openai_key:
        raise ValueError("Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured in the environment.")

    # Formulate the analysis prompt
    prompt = f"Analyze the writing process for the essay titled '{title}'.\n\n"
    prompt += "Below are the drafts in chronological order:\n"
    for i, draft in enumerate(drafts):
        prompt += f"--- DRAFT {i+1}: {draft['label']} ---\n"
        prompt += f"{draft['content']}\n\n"

    if reflection:
        prompt += f"--- AUTHOR'S REFLECTION ---\n{reflection}\n\n"

    prompt += (
        "Based on these drafts and the reflection (if provided), write a single, professional, neutral paragraph "
        "describing how the piece evolved across the drafts. Focus on tone shifts, structural changes, "
        "argument development, and details that show how the writer refined the work. Do not use markdown bullet points. "
        "Keep it concise, objective, and around 4-6 sentences. Do not mention specific drafts by label unless relevant "
        "to highlight a specific change."
    )

    # Try Gemini API if key is present
    if gemini_key:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            if response.text:
                return response.text.strip()
            raise Exception("Gemini returned empty text.")
        except Exception as e:
            if not openai_key:
                raise RuntimeError(f"Gemini API failure: {str(e)}")
            # Fall back to OpenAI if it's available
            print(f"Gemini API call failed, attempting fallback to OpenAI: {e}")

    # Fall back/alternative: OpenAI API
    if openai_key:
        try:
            client = openai.OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert writing process analyzer helping students understand how their writing evolved."},
                    {"role": "user", "content": prompt}
                ]
            )
            content = response.choices[0].message.content
            if content:
                return content.strip()
            raise Exception("OpenAI returned empty content.")
        except Exception as e:
            raise RuntimeError(f"OpenAI API failure: {str(e)}")
