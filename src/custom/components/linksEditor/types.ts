type tTarget = "_blank" | "_self"

interface iLink {
    id: number;
    sequence: number;
    url: string;
    label: string;
    target: tTarget;
    visible: boolean;
}

export type {
    tTarget,
    iLink
}