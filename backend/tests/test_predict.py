import base64

def test_predict_live_unauthorized(client):
    # Posting without token should return 403 or 401
    response = client.post(
        "/api/predict/live",
        json={"image_data_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP/="}
    )
    assert response.status_code in [401, 403]

def test_predict_live_authorized(client):
    # Register and log in
    client.post(
        "/api/auth/register",
        json={
            "name": "Predictor User",
            "email": "predict@isl-nmf.org",
            "password": "Password123",
            "confirm_password": "Password123",
            "role": "user"
        }
    )
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "predict@isl-nmf.org",
            "password": "Password123"
        }
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1x1 black pixel JPEG base64
    tiny_jpeg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="

    # Make authorized request
    response = client.post(
        "/api/predict/live",
        json={"image_data_url": tiny_jpeg, "history": []},
        headers=headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "marker" in data
    assert "translation" in data
    assert "features" in data
    # Face shouldn't be detected on a 1x1 blank image
    assert data["features"]["face_detected"] is False
