export interface BaseMap<T> {
    [key: string]: T
}

export interface RepositoryMember {
    readonly id: string
}

export interface BaseRepository<T extends RepositoryMember> {
    readonly items: BaseMap<T>
    readonly sort: ReadonlyArray<string>
}

export interface RepositoryMemberInfo {
    readonly id: string
    readonly type: string
}