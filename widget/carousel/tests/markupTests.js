(function () {
     var ArrayAssert  = YAHOO.util.ArrayAssert,
         Assert       = YAHOO.util.Assert,
         carousel,
         carouselEl,
         Dom          = YAHOO.util.Dom,
         initFromMarkupTest,
         ObjectAssert = YAHOO.util.ObjectAssert;

    YAHOO.namespace("CarouselTests");

    initFromMarkupTest = new YAHOO.tool.TestCase({
            name: "Initialize from markup test",

            testCreation: function () {
                return Assert.areEqual(true,
                        Dom.hasClass(carouselEl, "yui-carousel-element"));
            },

            testNumItems: function () {
                return Assert.areEqual(5, carousel.get("numItems"));
            },

            testNumItemsInTable: function () {
                return Assert.areEqual(5, carousel._itemsTable.numItems);
            },

            testitemsInTable: function () {
                return Assert.areEqual(5, carousel._itemsTable.items.length);
            },

            testgetElementForItem: function () {
                var actual = [], expected = [], i;

                for (i = 0; i < 5; i++) {
                    expected.push(Dom.get("item" + (i+1)));
                    actual.push(carousel.getElementForItem(i));
                }
                return ArrayAssert.itemsAreEqual(expected, actual);
            },

            testgetElementForItems: function () {
                var expected = [], i;

                for (i = 0; i < 5; i++) {
                    expected.push(Dom.get("item" + (i+1)));
                }
                return ArrayAssert.itemsAreEqual(expected,
                        carousel.getElementForItems());
            },

            testClearItems: function () {
                carousel.clearItems();
                return Assert.areEqual(0, carousel.get("numItems")) &&
                       Assert.areEqual(0, carousel._itemsTable.numItems) &&
                       ArrayAssert.itemsAreEqual([],
                               carousel._itemsTable.items);
            },

            testAddItem: function () {
                carousel.addItem("Six");
                carousel.addItem("Seven", 0);
                return Assert.areEqual("Six", carousel.getItem(1).item) &&
                       Assert.areEqual("Seven", carousel.getItem(0).item);
            },

            testAddItems: function () {
                carousel.addItems([["Eight",0],["Nine",0]]);
                return Assert.areEqual("Six", carousel.getItem(3).item) &&
                       Assert.areEqual("Seven", carousel.getItem(2).item) &&
                       Assert.areEqual("Eight", carousel.getItem(1).item) &&
                       Assert.areEqual("Nine", carousel.getItem(0).item);
            },

            testgetItem: function () {
                var children = Dom.getChildrenBy(carouselEl,
                        function (node) {
                            return node.nodeName.toUpperCase() == "LI";
                        }),
                    els = [], i;

                for (i in children) {
                    els.push(children[i]);
                }

                return ObjectAssert.propertiesAreEqual({ className: "",
                                                         id: els[2].id,
                                                         item: "Seven" },
                                                       carousel.getItem(2));
            },

            testgetItems: function () {
                var children = Dom.getChildrenBy(carouselEl,
                        function (node) {
                            return node.nodeName.toUpperCase() == "LI";
                        }),
                    expected = [], i;

                function compareItems(a, b) {
                    return a.className === b.className &&
                           a.id === b.id && a.item === b.item;
                }

                for (i in children) {
                    expected.push({ className: "", id: children[i].id,
                                    item: children[i].innerHTML });
                }

                return ArrayAssert.itemsAreEquivalent(expected,
                                                      carousel.getItems(),
                                                      compareItems);
            },

            testgetItemPositionById: function () {
                var children = Dom.getChildrenBy(carouselEl,
                        function (node) {
                            return node.nodeName.toUpperCase() == "LI";
                        });

                return Assert.areEqual(2,
                        carousel.getItemPositionById(children[2].id));
            },

            testremoveItem: function () {
                var children = Dom.getChildrenBy(carouselEl,
                        function (node) {
                            return node.nodeName.toUpperCase() == "LI";
                        }),
                    item;

                item = children[2];
                carousel.removeItem(2);
                return Assert.areEqual(null, Dom.get(item.id)) &&
                       Assert.areEqual(3, carousel.get("numItems")) &&
                       Assert.areEqual(3, carousel._itemsTable.numItems);
            }
    });

    YAHOO.CarouselTests.markupTests = new YAHOO.tool.TestSuite({
            name: "Carousel (from Markup) Tests",

            setUp: function () {
                carousel   = new YAHOO.widget.Carousel("container");
                carouselEl = Dom.get("carousel");
                //carousel.render();
            },

            tearDown : function () {
                delete carousel;
            }
    });

    YAHOO.CarouselTests.markupTests.add(initFromMarkupTest);
})();
