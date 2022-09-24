import {
    SelectOptionsDialogComponent,
} from "../../components/poll/select-options-dialog/select-options-dialog.component"; // label

export interface TagOptions {
    name?: string;
    label?: string;
    multiple?: boolean;
}

export interface SelectDialogResponse {
    prompt: SelectOptionsDialogComponent;
    options: TagOptions[];
}
