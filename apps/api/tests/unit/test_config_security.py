"""
Unit tests for configuration security and production validation rules.
Verifies development defaults, production gating, and documentation endpoint isolation.
"""

import pytest
from apps.api.app.core.config import Settings
from apps.api.app.main import app as main_app
from apps.api.app.main import create_app
from fastapi.testclient import TestClient
from pydantic import ValidationError

VALID_TEST_SECRET = "test_secure_random_key_of_at_least_32_characters"
INSECURE_PLACEHOLDER = "insecure_development_secret_key_change_in_production"


def test_development_defaults_remain_valid():
    """Confirms development defaults initialize cleanly without requiring production secrets."""
    s = Settings()
    assert s.ENVIRONMENT == "development"
    assert s.DEBUG is True
    assert s.SECRET_KEY == INSECURE_PLACEHOLDER
    assert s.is_production is False


def test_production_valid_configuration_accepted():
    """Confirms production accepts valid 32+ char secret and DEBUG=False."""
    s = Settings(
        ENVIRONMENT="production",
        DEBUG=False,
        SECRET_KEY=VALID_TEST_SECRET,
    )
    assert s.ENVIRONMENT == "production"
    assert s.DEBUG is False
    assert s.is_production is True


def test_production_default_placeholder_secret_rejected():
    """Confirms production rejects the known development placeholder secret."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY=INSECURE_PLACEHOLDER,
        )
    assert "placeholder" in str(exc_info.value).lower()


def test_production_whitespace_padded_placeholder_rejected():
    """Confirms production rejects the development placeholder even with surrounding whitespace."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY=f"   {INSECURE_PLACEHOLDER}   ",
        )
    assert "placeholder" in str(exc_info.value).lower()


def test_production_missing_or_empty_secret_rejected():
    """Confirms production rejects empty or whitespace-only secrets."""
    with pytest.raises(ValidationError) as exc_info1:
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="",
        )
    assert "empty or whitespace" in str(exc_info1.value).lower()

    with pytest.raises(ValidationError) as exc_info2:
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="   ",
        )
    assert "empty or whitespace" in str(exc_info2.value).lower()


def test_production_short_secret_rejected():
    """Confirms production rejects secrets shorter than 32 characters."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="short_secret_only_24_chars",
        )
    assert "32 characters" in str(exc_info.value).lower()


def test_production_whitespace_padded_short_secret_rejected():
    """Confirms secrets whose stripped length is < 32 are rejected despite surrounding padding."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="      short_secret_24_chars     ",
        )
    assert "32 characters" in str(exc_info.value).lower()


def test_production_valid_secret_with_or_without_spaces_accepted():
    """Confirms production accepts secrets where stripped length >= 32."""
    s = Settings(
        ENVIRONMENT="production",
        DEBUG=False,
        SECRET_KEY=f"  {VALID_TEST_SECRET}  ",
    )
    assert s.is_production is True


def test_production_debug_true_rejected():
    """Confirms production rejects DEBUG=True."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            ENVIRONMENT="production",
            DEBUG=True,
            SECRET_KEY=VALID_TEST_SECRET,
        )
    assert "debug must be set to false" in str(exc_info.value).lower()


@pytest.mark.parametrize("env_name", ["prod", "staging", "PRODUCTION", "STAGING"])
def test_staging_and_prod_variants_enforce_same_security_rules(env_name: str):
    """Confirms all production environment aliases enforce identical security requirements."""
    s = Settings(
        ENVIRONMENT=env_name,
        DEBUG=False,
        SECRET_KEY=VALID_TEST_SECRET,
    )
    assert s.is_production is True

    with pytest.raises(ValidationError):
        Settings(
            ENVIRONMENT=env_name,
            DEBUG=False,
            SECRET_KEY=INSECURE_PLACEHOLDER,
        )

    with pytest.raises(ValidationError):
        Settings(
            ENVIRONMENT=env_name,
            DEBUG=False,
            SECRET_KEY=f"   {INSECURE_PLACEHOLDER}   ",
        )

    with pytest.raises(ValidationError):
        Settings(
            ENVIRONMENT=env_name,
            DEBUG=True,
            SECRET_KEY=VALID_TEST_SECRET,
        )


def test_development_is_not_broken_by_production_validation():
    """Confirms development environments allow development defaults, placeholders, and DEBUG=True."""
    s_dev = Settings(
        ENVIRONMENT="development",
        DEBUG=True,
        SECRET_KEY=INSECURE_PLACEHOLDER,
    )
    assert s_dev.is_production is False

    s_dev_short = Settings(
        ENVIRONMENT="development",
        DEBUG=False,
        SECRET_KEY="dev_key",
    )
    assert s_dev_short.is_production is False


@pytest.mark.parametrize("env_name", ["production", "prod", "staging"])
def test_documentation_endpoints_disabled_in_production_mode(env_name: str):
    """Confirms the actual application disables /docs, /redoc, and /openapi.json in production/staging."""
    prod_cfg = Settings(
        ENVIRONMENT=env_name,
        DEBUG=False,
        SECRET_KEY=VALID_TEST_SECRET,
    )
    prod_app = create_app(prod_cfg)
    client = TestClient(prod_app)
    assert client.get("/docs").status_code == 404
    assert client.get("/redoc").status_code == 404
    assert client.get("/openapi.json").status_code == 404


def test_documentation_endpoints_enabled_in_development_mode():
    """Confirms the actual application enables /docs, /redoc, and /openapi.json in development."""
    dev_cfg = Settings(ENVIRONMENT="development", DEBUG=True)
    dev_app = create_app(dev_cfg)
    client = TestClient(dev_app)
    assert client.get("/docs").status_code == 200
    assert client.get("/redoc").status_code == 200
    assert client.get("/openapi.json").status_code == 200


@pytest.mark.parametrize("env_name", ["production", "prod", "staging"])
def test_root_endpoint_docs_reference_in_production(env_name: str):
    """Confirms the actual root endpoint returns docs=None in production, prod, and staging."""
    prod_cfg = Settings(
        ENVIRONMENT=env_name,
        DEBUG=False,
        SECRET_KEY=VALID_TEST_SECRET,
    )
    prod_app = create_app(prod_cfg)
    client = TestClient(prod_app)
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["message"] == "CoCollaber API Foundation"
    assert data["health"] == "/api/v1/health"
    assert data["docs"] is None


def test_root_endpoint_docs_reference_in_development():
    """Confirms the actual default application returns docs='/docs' in development."""
    client = TestClient(main_app)
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["message"] == "CoCollaber API Foundation"
    assert data["health"] == "/api/v1/health"
    assert data["docs"] == "/docs"
