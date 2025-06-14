export type HttpErrorCause =
    | 'BAD_REQUEST'
    | 'UNAUTHORIZED'
    | 'PAYMENT_REQUIRED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'METHOD_NOT_ALLOWED'
    | 'NOT_ACCEPTABLE'
    | 'PROXY_AUTHENTICATION_REQUIRED'
    | 'REQUEST_TIMEOUT'
    | 'CONFLICT'
    | 'GONE'
    | 'LENGTH_REQUIRED'
    | 'PRECONDITION_FAILED'
    | 'REQUEST_ENTITY_TOO_LARGE'
    | 'REQUEST_URI_TOO_LONG'
    | 'UNSUPPORTED_MEDIA_TYPE'
    | 'REQUESTED_RANGE_NOT_SATISFIABLE'
    | 'EXPECTATION_FAILED'
    | 'INTERNAL_SERVER_ERROR'
    | 'NOT_IMPLEMENTED'
    | 'BAD_GATEWAY'
    | 'SERVICE_UNAVAILABLE'
    | 'GATEWAY_TIMEOUT'
    | 'HTTP_VERSION_NOT_SUPPORTED';

export type HTTPErrorCode =
    | 400
    | 401
    | 402
    | 403
    | 404
    | 405
    | 406
    | 407
    | 408
    | 409
    | 410
    | 411
    | 412
    | 413
    | 414
    | 415
    | 416
    | 417
    | 500
    | 501
    | 502
    | 503
    | 504
    | 505;

export const httpCauseCode: Record<HTTPErrorCode, HttpErrorCause> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    402: 'PAYMENT_REQUIRED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    405: 'METHOD_NOT_ALLOWED',
    406: 'NOT_ACCEPTABLE',
    407: 'PROXY_AUTHENTICATION_REQUIRED',
    408: 'REQUEST_TIMEOUT',
    409: 'CONFLICT',
    410: 'GONE',
    411: 'LENGTH_REQUIRED',
    412: 'PRECONDITION_FAILED',
    413: 'REQUEST_ENTITY_TOO_LARGE',
    414: 'REQUEST_URI_TOO_LONG',
    415: 'UNSUPPORTED_MEDIA_TYPE',
    416: 'REQUESTED_RANGE_NOT_SATISFIABLE',
    417: 'EXPECTATION_FAILED',
    500: 'INTERNAL_SERVER_ERROR',
    501: 'NOT_IMPLEMENTED',
    502: 'BAD_GATEWAY',
    503: 'SERVICE_UNAVAILABLE',
    504: 'GATEWAY_TIMEOUT',
    505: 'HTTP_VERSION_NOT_SUPPORTED',
};

export class ApplicationError<T extends string = string> extends Error {
    constructor(_message: T | HttpErrorCause | HTTPErrorCode) {
        let cause: T | HttpErrorCause;
        if (httpCauseCode[_message as HTTPErrorCode]) {
            cause = httpCauseCode[_message as keyof typeof httpCauseCode];
        } else {
            cause = _message as T | HttpErrorCause;
        }

        super(cause);

        if (_message in httpCauseCode) {
            this._code = _message as HTTPErrorCode;
        }
    }

    private readonly _code?: HTTPErrorCode;

    get code(): HTTPErrorCode | undefined {
        return this._code;
    }

    override get message(): T | HttpErrorCause {
        return super.message as HttpErrorCause | T;
    }
}
