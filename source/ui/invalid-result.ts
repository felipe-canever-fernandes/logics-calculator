export class InvalidResult extends Error {
	public constructor(message?: string) {
		super(message);
		this.name = "InvalidResult";
	}
}
