export class SortedQueue<T extends { currentCost: Number }> {
    private _list = [] as T[]

    constructor(els: Iterable<T>) {
        this._list = Array.from(els)
    }

    pop() {
        let current = this._list.splice(0, 1)
        return current[0]
    }

    push(el: T) {
        if (this._list.length == 0) {
            this._list = [el]
        } else {
            let targetIdx = this.getIndexForInsert(el)
            this._list = [...this._list.slice(0, targetIdx), el, ...this._list.slice(targetIdx)]
        }
    }

    print() {
        let nodes = this._list
        console.log("    [" + nodes.map(it => it.currentCost).join(',') + "]")
    }

    remove(el: T) {
        if (this._list.length == 0) return null

        let targetIdx = this.getIndexForRemove(el)
        if (targetIdx == -1) {
            return null
        } else {
            this._list.splice(targetIdx, 1)
            return el
        }
    }

    private findExactIdxForRemoval(el: T, aroundIdx: number) {
        let leftIdx = aroundIdx - 1, rightIdx = aroundIdx + 1
        while (true) {
            let leftVal = null as T | null, rightVal = null as T | null
            if (0 <= leftIdx) {
                leftVal = this._list[leftIdx]
            }
            if (rightIdx < this._list.length - 1) {
                rightVal = this._list[rightIdx]
            }
            if ((leftVal == null && rightVal == null) || (leftVal?.currentCost != el.currentCost && rightVal?.currentCost != el.currentCost)) {
                return -1
            }
            if (leftVal === el) return leftIdx
            if (rightVal === el) return rightIdx
            leftIdx = leftIdx - 1, rightIdx = rightIdx + 1
        }
    }

    private getIndexForInsert(el: T) {
        let left = 0, right = this._list.length - 1
        let midIdx = 0
        let elAtCurrentIdx: T

        while (right >= left) {
            midIdx = Math.floor((right + left) / 2)
            elAtCurrentIdx = this._list[midIdx]
            if (el.currentCost < elAtCurrentIdx.currentCost) {
                right = midIdx - 1
            } else if (el.currentCost > elAtCurrentIdx.currentCost) {
                left = midIdx + 1
            } else {
                return midIdx
            }
        }

        return el.currentCost > elAtCurrentIdx!.currentCost ? midIdx + 1 : midIdx
    }

    private getIndexForRemove(el: T) {
        let left = 0, right = this._list.length - 1
        let midIdx = 0
        let elAtCurrentIdx: T

        while (right >= left) {
            midIdx = Math.floor((right + left) / 2)
            elAtCurrentIdx = this._list[midIdx]
            if (el.currentCost < elAtCurrentIdx.currentCost) {
                right = midIdx - 1
            } else if (el.currentCost > elAtCurrentIdx.currentCost) {
                left = midIdx + 1
            } else {
                return el === elAtCurrentIdx ? midIdx : this.findExactIdxForRemoval(el, midIdx)
            }
        }

        return -1
    }
}
