interface ResponseType {
  [key: string]: any
}

export class ResponseBuilder {
  private success: boolean
  private message: string
  private data: any
  private meta: any
  private errors: any

  constructor(data: any = null) {
    this.data = data
    this.success = true
    this.message = '';
    return this
  }

  public err(message: string = '', errors = null) {
    this.success = false
    this.errors = errors
    this.setMessage(message)
    return this
  }

  public setMessage(message: string) {
    this.message = message
    return this
  }

  public setMeta(meta: any) {
    this.meta = meta
    return this
  }

  public toJSON(): any {
    const res: ResponseType = {}

    for (const [key, value] of Object.entries(this)) {
      if (value !== undefined && value !== null) {
        res[key] = value
      }
    }

    return res
  }
}
