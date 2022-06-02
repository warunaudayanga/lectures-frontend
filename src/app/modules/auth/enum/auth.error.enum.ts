export enum AuthError {
    AUTH_400_EMPTY_UNAME = "AUTH_400_EMPTY_UNAME",
    AUTH_400_EMPTY_PASSWORD = "AUTH_400_EMPTY_PASSWORD",
    AUTH_401_INVALID = "AUTH_401_INVALID",
    AUTH_401_NOT_LOGGED_IN = "AUTH_401_NOT_LOGGED_IN",
    AUTH_401_INVALID_TOKEN = "AUTH_401_INVALID_TOKEN",
    AUTH_500_LOGIN = "AUTH_500_LOGIN",
    AUTH_500 = "AUTH_500",
    USER_400_EMPTY_FNAME = "USER_400_EMPTY_FNAME",
    USER_400_EMPTY_LNAME = "USER_400_EMPTY_LNAME",
    USER_400_EMPTY_UNAME = "USER_400_EMPTY_UNAME",
    USER_400_EMPTY_PASSWORD = "USER_400_EMPTY_PASSWORD",
    USER_400_NOT_EMPTY_UNAME = "USER_400_NOT_EMPTY_UNAME",
    USER_400_NOT_EMPTY_PASSWORD = "USER_400_NOT_EMPTY_PASSWORD",
    USER_400_NOT_EMPTY_SALT = "USER_400_NOT_EMPTY_SALT",
    USER_404 = "USER_404",
    USER_409_EXIST_USERNAME = "USER_409_EXIST_USERNAME",
    USER_409_EXIST_UNAME = "USER_409_EXIST_UNAME",
    USER_500_CREATE = "USER_500_CREATE",
}