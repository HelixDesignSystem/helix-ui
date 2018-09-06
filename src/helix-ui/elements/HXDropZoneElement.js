import { HXElement } from './HXElement';

export class HXDropZoneElement extends HXElement {
    static get is () {
        return 'hx-drop-zone';
    }

    $onCreate () {
        this._isDragging = false;
        this._isZoneDragging = false;
        this._onDocDragLeave = this._onDocDragLeave.bind(this);
        this._onDocDragOver = this._onDocDragOver.bind(this);
        this._onDrop = this._onDrop.bind(this);
    }

    $onConnect () {
        document.addEventListener('dragleave', this._onDocDragLeave);
        document.addEventListener('dragover', this._onDocDragOver);
        document.addEventListener('drop', this._onDrop);
        this.addEventListener('dragleave', this._onDragLeave);
        this.addEventListener('dragover', this._onDragOver);
        this.addEventListener('drop', this._onDrop);
    }

    $onDisconnect () {
        document.removeEventListener('dragleave', this._onDocDragLeave);
        document.removeEventListener('dragover', this._onDocDragOver);
        document.removeEventListener('drop', this._onDrop);
        this.removeEventListener('dragleave', this._onDragLeave);
        this.removeEventListener('dragover', this._onDragOver);
        this.removeEventListener('drop', this._onDrop);
    }

    get drag () {
        return this.getAttribute('drag');
    }

    /** @private */
    _isFileDrag (evt) {
        return (evt.dataTransfer.types.indexOf('Files') !== -1);
    }

    // #2 this gets called when the dragged item leaves the document (leaves to a child element or window altogether)
    /** @private */
    _onDocDragLeave () {
        // callback must be an arrow function to preserve "this"
        this._docDragLeaveTimeout = window.setTimeout(() => {
            this._isDragging = false;
            this.removeAttribute('drag');
        }, 0);
    }

    // #1 this handler fires continuously as long as the user is dragging on the page
    /** @private */
    _onDocDragOver (evt) {
        if (!this._isDragging) {
            this._isDragging = true;
            if (this._isFileDrag(evt)) {
                this.setAttribute('drag', 'away');
            }
        }
        window.clearTimeout(this._docDragLeaveTimeout);
    }

    // #4 this gets called when the dragged item leaves the zone (leaves to a child element or zone altogether)
    /** @private */
    _onDragLeave (evt) {
        evt.preventDefault();
        // callback must be an arrow function to preserve "this"
        this._zoneDragLeaveTimeout = window.setTimeout(() => {
            this._isZoneDragging = false;
            this.setAttribute('drag', 'away');
        }, 0);
    }

    // #3 this handler fires continuously as long as the user is dragging on the zone
    /** @private */
    _onDragOver (evt) {
        evt.preventDefault();
        if (!this._isZoneDragging) {
            this._isZoneDragging = true;
            if (this._isFileDrag(evt)) {
                this.setAttribute('drag', 'over');
            }
        }
        window.clearTimeout(this._zoneDragLeaveTimeout);
    }

    /** @private */
    _onDrop (evt) {
        //evt.preventDefault();
        this.removeAttribute('drag');
        this._isDragging = false;
        this._isZoneDragging = false;
    }
}
