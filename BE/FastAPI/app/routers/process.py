from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.models.dto import (
    LogRequest, LogFilesRequest, ValidateAPIRequest, EnvUpdateRequest
)
from app.services.generate_summaries import (
    generate_log_summary, generate_performance_summary, generate_daily_summary,
    generate_trend_summary, generate_recommend, generate_hourly_summary,
    validate_openai_api_key
)
from app.services.conversation_manager import ConversationManager
from app.services.rag_service import Rag_Service
from app.utils.utils import combine_logs_and_question, get_user_id_from_token
from app.settings import env_file_path, reload_settings
from dotenv import set_key, load_dotenv

router = APIRouter()

@router.post("/process/logSummary")
async def process_log_summary(request: LogRequest):
    log_summary, is_urgent = await generate_log_summary(request.content)
    
    return {
        "logSummary": log_summary,
        "isUrgent": is_urgent
    }

@router.post("/process/performanceSummary")
async def process_performance_summary(request: LogRequest):
    performance_summary = await generate_performance_summary(request.content)
    
    return {
        "performanceSummary": performance_summary
    }

@router.post("/process/dailySummary")
async def process_daily_summary(request: LogRequest):
    daily_summary = await generate_daily_summary(request.content)
    
    return {
        "dailySummary": daily_summary
    }

@router.post("/process/trendSummary")
async def process_daily_summary(request: LogRequest):
    trend_summary = await generate_trend_summary(request.content)
    
    return {
        "trendSummary": trend_summary
    }

@router.post("/process/recommend")
async def process_recommend(request: LogRequest):
    recommend = await generate_recommend(request.content)
    
    return {
        "recommend": recommend
    }

@router.post("/process/hourlySummary")
async def process_hourly_summary(request: LogRequest):
    hourly_summary = await generate_hourly_summary(request.content)
    
    return {
        "hourlySummary": hourly_summary
    }

@router.post("/api/logs/question")
async def process_logs_and_question(
    request: LogFilesRequest,
    user_id: int = Depends(get_user_id_from_token)
):
    conversation_manager = ConversationManager(user_id)

    final_question = combine_logs_and_question(request, conversation_manager)

    rag_service = Rag_Service()

    response_collector = []

    async def stream_response():
        async for chunk in rag_service.generate_text_streaming(final_question):
            response_collector.append(chunk)  
            yield chunk

        complete_response = ''.join(response_collector)
        conversation_manager.add_to_history(request.question, complete_response)

    return StreamingResponse(stream_response(), media_type='text/event-stream')
    
@router.post("/validate-api-key")
async def validate_api_key(request: ValidateAPIRequest):
    is_valid = await validate_openai_api_key(request.apiKey)
    
    if is_valid:
        return {"isValid": True}
    else:
        return {"isValid": False}
        
@router.post("/update-env")
async def update_env(request: EnvUpdateRequest):
    key, value = request.key, request.value

    try:
        load_dotenv(env_file_path)
        
        set_key(env_file_path, key, f'"{value}"')

        load_dotenv(env_file_path, override=True)

        reload_settings()

        return {"success": True}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f".env 파일 업데이트 실패: {str(e)}")