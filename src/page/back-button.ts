interface BackButtonProps {
    /**
     * True if image was loaded when the document loaded.
     * Changes back button behavior so that it doesn't navigate away
     * from the page accidentally.
     */
    readonly firstLoad: boolean;
}

const BACK_BUTTON = document.querySelector<HTMLButtonElement>('#back')!;

/**
 * Set the `data-firstload` on the back button.
 */
export function displayBackButton(props: BackButtonProps) {
    if (props.firstLoad) {
        BACK_BUTTON.dataset.firstload = 'firstload';
    } else {
        delete BACK_BUTTON.dataset.firstload;
    }
}

/**
 * When the back button is clicked, only go back if the `data-firstload`
 * attribute is not present.
 */
export function goBack() {
    if (!BACK_BUTTON.dataset.firstload) {
        history.back();
    }
}
