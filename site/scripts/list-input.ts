// this is my logic for the list inputs


export class ListInput {
    keyWord: string;

    list: HTMLOListElement;
    addBtn: HTMLButtonElement;
    clearBtn: HTMLButtonElement;
    
    inputInstance: HTMLLIElement;

    labelElem: HTMLLabelElement;

    idxCount: number = 0;

    constructor(list: HTMLOListElement, addBtn: HTMLButtonElement, clearBtn: HTMLButtonElement) {
        // init attrs
        this.list = list;
        this.addBtn = addBtn;
        this.clearBtn = clearBtn;
        this.labelElem = this.list.parentElement as HTMLLabelElement;
        this.keyWord = this.labelElem.htmlFor.split("-")[0];

        this.inputInstance = (this.list.firstElementChild as HTMLLIElement).cloneNode(true) as HTMLLIElement;
        (this.inputInstance.firstElementChild as HTMLInputElement).value = "";

        // connect everything.
        this.addBtn.addEventListener("click", this.addItem.bind(this));
        this.__connectRmBtn(this.list.firstElementChild as HTMLLIElement);
        this.__addShortcuts(this.list.firstElementChild as HTMLLIElement);

        this.clearBtn.addEventListener("click", this.clearList.bind(this));
    
    }

    __connectRmBtn(itemElem: HTMLLIElement) {
        const rmBtn = itemElem.getElementsByClassName(REMOVE_CLASS)[0] as HTMLButtonElement;

        if (rmBtn) {
            rmBtn.addEventListener("click", this.removeItem.bind(this, this.idxCount))
        }
    }

    __addShortcuts(itemElem: HTMLLIElement) {
        // create actions
        const addItem = this.addItem.bind(this);
        
        const input = itemElem.firstElementChild as HTMLInputElement;

        // bind
        input.addEventListener("keyup", (ev: KeyboardEvent) => {
            if (ev.key === "Enter") addItem().focus();
        })
    }

    addItem(): HTMLInputElement {
        this.idxCount ++;
        const newBaby = this.inputInstance.cloneNode(true) as HTMLLIElement;
        (newBaby.firstElementChild as HTMLInputElement).id = `${this.keyWord}-${this.idxCount}`;
        
        // also update remove button
        this.__connectRmBtn(newBaby);
        this.__addShortcuts(newBaby);
        
        this.list.appendChild(newBaby);
        this.labelElem.htmlFor = (newBaby.firstElementChild as HTMLInputElement).id;

        return newBaby.firstElementChild as HTMLInputElement;
    }

    /**
     * 
     * @param idxID note that this refers to the id label, not the position.
     */
    removeItem(idxID: number) {
        const input = document.getElementById(`${this.keyWord}-${idxID}`);

        if (!input) return;

        const item = input.parentElement as HTMLLIElement;
        item.remove();

        // fix the for
        this.labelElem.htmlFor = (this.list.lastElementChild?.firstElementChild as HTMLInputElement).id;
    }

    clearList() {
        // remove all
        this.list.replaceChildren();

        this.addItem();
    }

    values(): string[] {
        return Array.from(this.list.children, (v: Element) => {
            if (v.tagName !== "LI") return;
            else if (v.firstElementChild?.tagName !== "INPUT") return;
            return (v.firstElementChild as HTMLInputElement).value;
        }).filter((v: string | undefined) => !!v ) as string[];
    }
}



// constants for different class names
const LIST_CLASS = "field-list";
const ADD_CLASS ="add-list-item";
const CLEAR_CLASS ="clear-list";
const REMOVE_CLASS = "remove-item";


// get each of each
const itemLists = document.getElementsByClassName(LIST_CLASS);
const addButtons = document.getElementsByClassName(ADD_CLASS);
const clearButtons = document.getElementsByClassName(CLEAR_CLASS);


(window as any).itemListInputs = Array.from(itemLists).map((v: Element, idx: number) => {
    return new ListInput(
        v as HTMLOListElement,
        addButtons[idx] as HTMLButtonElement,
        clearButtons[idx] as HTMLButtonElement
    );
})
