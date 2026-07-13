def test_register_user(client):
    # Test valid registration
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@isl-nmf.org",
            "password": "Password123",
            "confirm_password": "Password123",
            "role": "user"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@isl-nmf.org"
    assert data["role"] == "user"
    assert "id" in data

def test_register_mismatched_passwords(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@isl-nmf.org",
            "password": "Password123",
            "confirm_password": "MismatchPassword",
            "role": "user"
        }
    )
    # Registration should fail validation
    assert response.status_code == 422

def test_login_and_profile(client):
    # Register first
    client.post(
        "/api/auth/register",
        json={
            "name": "Login User",
            "email": "login@isl-nmf.org",
            "password": "Password123",
            "confirm_password": "Password123",
            "role": "user"
        }
    )

    # Log in
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "login@isl-nmf.org",
            "password": "Password123"
        }
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    token = login_data["access_token"]

    # Access protected profile
    headers = {"Authorization": f"Bearer {token}"}
    profile_response = client.get("/api/users/profile", headers=headers)
    assert profile_response.status_code == 200
    profile_data = profile_response.json()
    assert profile_data["email"] == "login@isl-nmf.org"

def test_login_invalid_credentials(client):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@isl-nmf.org",
            "password": "WrongPassword"
        }
    )
    assert response.status_code == 411 or response.status_code == 401
