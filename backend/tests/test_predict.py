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

    # 10x10 black pixel JPEG base64
    tiny_jpeg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+f+iiigD/2Q=="

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
