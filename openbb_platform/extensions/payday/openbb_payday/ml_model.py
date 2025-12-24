from sklearn.linear_model import LogisticRegression
import numpy as np

# Sample data: [monthly_income, loan_amount_requested]
X = np.array([[2000, 500], [5000, 1000], [8000, 1500], [1000, 600], [6000, 800]])
# 1 for approved, 0 for rejected
y = np.array([0, 1, 1, 0, 1])

model = LogisticRegression()
model.fit(X, y)

def predict_approval(application) -> bool:
    """
    Predicts whether a loan application should be approved.
    """
    features = np.array([[application["monthly_income"], application["loan_amount_requested"]]])
    prediction = model.predict(features)
    return bool(prediction[0])
