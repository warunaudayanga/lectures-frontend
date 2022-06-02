import { Inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Observable, Subject } from "rxjs";
import { ShortcutEvent } from "../interfaces/shortcut.interfaces";

@Injectable({
    providedIn: "root",
})
export class ShortcutService {

    released = true;

    keyListener: Subject<ShortcutEvent> = new Subject<ShortcutEvent>();

    constructor(@Inject(DOCUMENT) private readonly document: Document) { }

    registerRelease(): void {
        this.released = true;
    }

    onKey(): Observable<ShortcutEvent> {
        return this.keyListener.asObservable();
    }

    click(elem: Element | null | undefined): void {
        (elem as HTMLElement)?.click();
    };

    focus(elem: Element | null | undefined): void {
        (elem as HTMLElement)?.focus();
    };

    select(elem: Element | null | undefined): void {
        (elem as HTMLInputElement)?.select();
    };

    handleShortcut(e: KeyboardEvent): void {

        const loading = this.document.querySelector("[data-key-loader]") as HTMLDivElement | null;

        if (!loading) {

            // console.log("key:", e.key, "code:", e.code);
            const inputElementTagNames = ["INPUT", "SELECT", "TEXTAREA"];
            const focusedElement = e.target as HTMLElement;

            const dialog = this.document.querySelector("[data-dialog]") as HTMLDivElement | null;
            const table = this.document.querySelector("[data-data-table]") as HTMLTableElement | null;
            // const pagination = this.document.querySelector("[data-pagination]") as HTMLDivElement | null;
            const targetElement = this.document.querySelector(`[data-key='${e.code}']`) as HTMLElement;

            if (inputElementTagNames.includes(focusedElement.tagName)) {
                // const currentInput = focusedElement as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
                if (e.code === "Escape" && dialog) {
                    targetElement.click();
                }
                return;
            }

            if (dialog && this.released) {
                const focusedButton = dialog.querySelector("button:focus");
                if (!focusedButton) {
                    this.focus(dialog?.querySelector("button"));
                } else if (e.code === "ArrowLeft") {
                    this.focus(focusedButton?.previousElementSibling);
                } else if (e.code === "ArrowRight") {
                    this.focus(focusedButton?.nextElementSibling);
                } else if (e.code === "Escape") {
                    targetElement.click();
                }
                return;
            }

            if (table?.offsetParent && !dialog) {
                this.keyListener.next({ e, released: this.released });
                e.preventDefault();
            }

            if (targetElement) {
                if (!inputElementTagNames.includes(focusedElement.tagName)) {
                    targetElement.click();
                    e.preventDefault();
                }
            }

            this.released = false;
        }
    }
}
