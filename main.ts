interface IItem {
    id: number | string,
    parent: number | string,
    type?: any,
}

class TreeStore {
    itemsMap: any
    parentsMap: any
    constructor(items: IItem[]) {
        this.itemsMap = {}
        this.parentsMap = {}

        // Создание карты элементов и карты родителей
        for (const item of items) {
            this.itemsMap[item.id] = item
            const parentId = item.parent
            if (!(parentId in this.parentsMap)) {
                this.parentsMap[parentId] = []
            }
            this.parentsMap[parentId].push(item.id)
        }
    }

    getAll() {
        return Object.values(this.itemsMap)
    }

    getItem(id:  number | string) {
        return this.itemsMap[id]
    }

    getChildren(id:  number | string) {
        return (this.parentsMap[id] || []).map((item: number | string) => this.itemsMap[item])
    }

    getAllChildren(id:  number | string) {
        const result = []
        const stack = [id]
        while (stack.length > 0) {
            const currentId = stack.pop()
            const children = currentId ? this.getChildren(currentId) : null
            result.push(...children)
            stack.push(...children.map((item: IItem) => item.id))
        }
        return result
    }

    // Хочу заметить, что в условии написано: "Принимает id элемента и возвращает массив из цепочки родительских элементов, начиная от самого элемента, чей id был передан в аргументе и до корневого элемента,"
    // Что противоречит тому, что показано в примерах, там не хвататет самого элемента, от которого все начинается
    // Так же в условии сказано от самого элемента, к корню дерева, то есть вывод должен быть снизу вверх.
    getAllParents(id:  number | string) {
        const result = []
        let parentId = id ? id : undefined
        while (parentId !== undefined) {
            const parent = this.itemsMap[parentId]
            if (parent) {
                result.unshift(parent)
                parentId = parent.parent
            } else {
                parentId = undefined
            }
        }
        return result;
    }
}

const items = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];

const ts = new TreeStore(items)