from pydantic import BaseModel

class LogRequest(BaseModel):
    content: str

class Question(BaseModel):
    question: str

class LogFile(BaseModel):
    name: str

class LogFilesRequest(BaseModel):
    logFiles: list[LogFile]
    question: str
    isFirstQuestion: bool  

class ValidateAPIRequest(BaseModel):
    apiKey: str

class EnvUpdateRequest(BaseModel):
    key: str
    value: str