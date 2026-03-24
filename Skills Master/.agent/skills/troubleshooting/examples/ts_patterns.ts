export type Result<T, E = Error> =
    | { ok: true; value: T }
    | { ok: false; error: E };

export function Ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
}

export function Err<E>(error: E): Result<never, E> {
    return { ok: false, error };
}

export class ApplicationError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Example usage
async function getUser(id: string): Promise<Result<any, ApplicationError>> {
    try {
        const data = await fetch(`/api/users/${id}`);
        if (!data.ok) {
            return Err(new ApplicationError("User not found", "USER_404", 404));
        }
        const user = await data.json();
        return Ok(user);
    } catch (e) {
        return Err(new ApplicationError("Network error", "NETWORK_ERROR"));
    }
}
